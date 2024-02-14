import os
from dotenv import load_dotenv  

from flask import Flask, request, jsonify
from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
import re
import json


from langchain.chains import LLMChain
from langchain.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
)



app = Flask(__name__)

# get api key from environment variable
load_dotenv()
API_KEY = os.getenv("API_KEY")

# LLM
llm = ChatOpenAI(api_key=API_KEY, model="gpt-4")


prompt = None
quAsked = 0
target = 2
conversation = None


# Open and read the JSON file
with open("./events.json", "r") as file:
    json_string = file.read()

# Convert JSON string to Python object
eventsObject = json.loads(json_string)
allevents = json.loads(json_string)

# Replace curly braces in the original JSON string
events = json_string.replace("{", "(").replace("}", ")")

# Prompt
prompt = ChatPromptTemplate(
messages=[
    SystemMessagePromptTemplate.from_template(
        f"You are a students events advisor, here is the list of events available: {events} you must ask the user a series of questions to recomend them which event they should attend. keep the questions short and concise under 20 words"
    ),
    # The `variable_name` here is what must align with memory
    MessagesPlaceholder(variable_name="chat_history"),
    HumanMessagePromptTemplate.from_template("{question}"),
]
)


# initialise chat memory and llm chain
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
conversation = LLMChain(llm=llm, prompt=prompt, verbose=True, memory=memory)


def find_integers_in_string(s):
    # Find all non-overlapping matches of the regular expression \d+ in the string
    matches = re.findall(r'\d+', s)
    # Convert the found strings to integers
    integers = [int(match) for match in matches]
    return integers[0]

def invoke(query):
    global quAsked, prompt, conversation, memory

    
    # get first question based of user context input
    nextQu = conversation({"question": query})
    print(memory)
    quAsked = quAsked + 1
    return(nextQu['text'])

def get_event_by_id(events_object, event_id):
    # Loop through each event in the results array
    for event in events_object["results"]:
        # Check if the current event's id matches the event_id parameter
        if event["id"] == event_id:
            # If a match is found, return the event
            return event
    # If no match is found, return None or an appropriate message
    return None

@app.route('/invoke', methods=['POST'])
def continue_story():
    global quAsked, target
    if request.is_json:
        if quAsked == target:
            llmResponse = llm.invoke(f"return a single integer of the id of an event that most closely matches with the current conversation conversation[[{memory}]] event-dataset[[{events}]].")
            eventid = find_integers_in_string(llmResponse.content)
            print(llmResponse.content)
            if eventid == None:
                target = target + 2
                data = request.get_json()
                answer = invoke(data["query"])
                return jsonify({'response': answer})
            event = get_event_by_id(eventsObject, eventid)
            print(event)
            target = target + 3
            eventsObject["results"] = [event for event in eventsObject["results"] if event["id"] != eventid]
            return jsonify({'response': 'found', 'event': event })
        data = request.get_json()
        answer = invoke(data["query"])
        return jsonify({'response': answer})
    else:
        return "Request is not in JSON format"

@app.route('/getEvents', methods=['GET'])
def get_events():
    return jsonify({'response': allevents})
        

if __name__ == '__main__':
    app.run(debug=True)


