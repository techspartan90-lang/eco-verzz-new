from rest_framework import serializers


class DashboardDataSerializer(serializers.Serializer):
    role = serializers.CharField()
    username = serializers.CharField()
    reward_points = serializers.IntegerField()
    carbon_score = serializers.FloatField()
    stats = serializers.DictField()
