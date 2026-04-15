from  database.mongDB import companies_collection


def get_all_companies():
    companies = list(companies_collection.find({}, {"_id": 0}))
    return companies