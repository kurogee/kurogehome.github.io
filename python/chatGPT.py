import openai

# chatGPT「もどき」です。もどきという英単語がわからないのでファイル名をchatGPT.pyにさせていただきました((
# Apply for an API Key at https://beta.openai.com/signup/
openai.api_key = "=== API KEY IS HERE ==="

model_engine = "text-davinci-003"

def chatmode():
    while 1:
        prompt = input("Enter text here >> ")
        print()
        completions = openai.Completion.create(
            engine=model_engine,
            prompt=prompt,
            max_tokens=1000,
            n=1,
            stop=None,
            temperature=0.5,
        )

        message = completions.choices[0].text
        print(f"User: {prompt}")
        print("Chat AI:\n{}".format(str(message).replace('\n', '', 2)))
        print("======================")

def normalmode(text: str):
    prompt = text
    completions = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=1000,
        n=1,
        stop=None,
        temperature=0.5,
    )
    
    message = completions.choices[0].text
    print(f"User: {prompt}\n")
    print("Chat AI:\n{}".format(str(message).replace('\n', '', 2)))

chatmode()
