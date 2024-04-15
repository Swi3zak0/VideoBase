import graphene
from firebase_admin import storage
import random
from ..models import Video
from ..types.type import VideoType
from graphene import Mutation, String, Boolean, Field


# class CreateVideoMutation(Mutation):
#     class Arguments:
#         video_bytes = String(required=True)
#         video_name = String(required=True)

#     success = Boolean()
#     video = Field(VideoType)
#     error = String()

#     @staticmethod
#     def mutate(root, info, video_bytes, video_name):
#         try:
#             bucket = storage.bucket()
#             blob = bucket.blob(f"videos/{video_name}")
#             blob.upload_from_string(video_bytes, content_type='video/mp4')
#             blob.make_public()

#             create_video = Video.objects.create(url=blob.public_url, name=video_name)
#             return CreateVideoMutation(success=True, video=create_video, error=None)
#         except Exception as e:
#             error_message = f"An error occurred while uploading the video: {str(e)}"
#             return CreateVideoMutation(success=False, video=None, error=error_message)


# class UpdateVideoMutation(graphene.Mutation):
#     class Arguments:
#         video_id = graphene.Int(required=True)
#         video = Upload(required=True)

#     success = graphene.Boolean()
#     video = graphene.Field(VideoType)
#     error = graphene.String()

#     @staticmethod
#     def mutate(root, info, video_id, video):
#         try:
#             video_obj = Video.objects.get(pk=video_id)

#             bucket = storage.bucket()
#             blob = bucket.blob(f"videos/{video.name}.{random.random()}")

#             blob.upload_from_file(video, content_type=video.content_type)
#             blob.make_public()

#             video_obj.url = blob.public_url
#             video_obj.name = video.name
#             video_obj.save()

#             return UpdateVideoMutation(success=True, video=video_obj, error=None)
#         except Exception as e:
#             error_message = f"An error occurred while updating the video: {str(e)}"
#             return UpdateVideoMutation(success=False, video=None, error=error_message)


# class DeleteVideoMutation(graphene.Mutation):
#     class Arguments:
#         video_id = graphene.Int(required=True)

#     success = graphene.Boolean()
#     error = graphene.String()

#     @staticmethod
#     def mutate(root, info, video_id):
#         try:
#             video_obj = Video.objects.get(pk=video_id)

#             bucket = storage.bucket()
#             blob = bucket.blob(f"videos/{video_obj.name}")
#             blob.delete()

#             video_obj.delete()

#             return DeleteVideoMutation(success=True, error=None)
#         except Exception as e:
#             error_message = f"An error occurred while deleting the video: {str(e)}"
#             return DeleteVideoMutation(success=False, error=error_message)
