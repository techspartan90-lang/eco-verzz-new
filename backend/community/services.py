class CommunityService:
    @staticmethod
    def toggle_like(post, user):
        if post.likes.filter(id=user.id).exists():
            post.likes.remove(user)
            liked = False
        else:
            post.likes.add(user)
            liked = True
        return liked, post.likes.count()

    @staticmethod
    def toggle_join_campaign(campaign, user):
        if campaign.participants.filter(id=user.id).exists():
            campaign.participants.remove(user)
            joined = False
        else:
            campaign.participants.add(user)
            joined = True
        return joined, campaign.participants.count()
