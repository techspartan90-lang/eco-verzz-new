from django.core.exceptions import ValidationError


class MarketplaceService:
    @staticmethod
    def buy_product(product, buyer):
        if not product.is_available or product.quantity < 1:
            raise ValidationError("Product is no longer available.")

        if buyer.reward_points < product.price:
            raise ValidationError(
                "Insufficient reward points to purchase this product.")

        # Transact points
        buyer.reward_points -= int(product.price)
        buyer.save()

        # Update seller points
        seller = product.seller
        seller.reward_points += int(product.price)
        seller.save()

        # Deduct quantity
        product.quantity -= 1
        if product.quantity == 0:
            product.is_available = False
        product.save()

        return product
