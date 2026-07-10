from app.models.plant import Plant


def apply_reward(plant: Plant, reward: dict[str, int]) -> None:
    """Apply a server-earned resource reward. Overflow is intentionally discarded."""
    sunlight = reward.get("sunlight", 0)
    water = reward.get("water", 0)
    fertilizer = reward.get("fertilizer", 0)
    if min(sunlight, water, fertilizer) < 0:
        raise ValueError("Garden rewards cannot be negative")

    plant.sunlight += sunlight
    plant.water += water
    plant.fertilizer += fertilizer
    gained_growth = sunlight * 10 + water * 10 + fertilizer * 15
    if plant.growth + gained_growth >= 100:
        plant.growth = 0
        plant.quantity += 1
        plant.stage += 1
    else:
        plant.growth += gained_growth
