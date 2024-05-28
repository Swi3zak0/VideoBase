import graphene
from ..views import send_contact_email

class ContactEmailMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        name = graphene.String()
        message = graphene.String()
    
    success = graphene.Boolean()

    def mutate(self, info, name, email, message):

        send_contact_email(name, email, message)

        success = True

        return ContactEmailMutation(success=success)
