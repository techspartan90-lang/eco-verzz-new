class UserService:
    @staticmethod
    def add_reward_points(user, points):
        user.reward_points += points
        user.save()
        return user.reward_points

    @staticmethod
    def add_carbon_offset(user, co2):
        user.carbon_score += co2
        user.save()
        return user.carbon_score
