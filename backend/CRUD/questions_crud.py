from database.mongDB import questions_collection

def get_all_questions():
    questions = []
    for question in questions_collection.find():
        question['_id'] = str(question['_id'])
        questions.append(question)
    return questions

def get_questions_by_topic(topic: str):
    questions = []
    for question in questions_collection.find({"topic": topic}):
        question['_id'] = str(question['_id'])
        questions.append(question)
    return questions

def get_questions_by_company(company: str):
    questions = []
    for question in questions_collection.find({"company": company}):
        question['_id'] = str(question['_id'])
        questions.append(question)
    return questions  

def get_questions_by_id(question_id: str):
    question = questions_collection.find_one({"_id": question_id})
    if question:
        question['_id'] = str(question['_id'])
    return question  

def get_questions_by_difficulty(difficulty: str):
    questions = []
    for question in questions_collection.find({"difficulty": difficulty}):
        question['_id'] = str(question['_id'])
        questions.append(question)
    return questions