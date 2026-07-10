from app.schemas.plant import PlantGrowRequest, PlantRead


def apply_growth(plant: PlantRead, growth: PlantGrowRequest) -> PlantRead:
    gained_growth = growth.sunlight * 10 + growth.water * 10 + growth.fertilizer * 15
    next_growth = min(100, plant.growth + gained_growth)
    next_quantity = plant.quantity + 1 if plant.growth < 100 and next_growth == 100 else plant.quantity

    return plant.model_copy(
        update={
            "growth": next_growth,
            "quantity": next_quantity,
            "sunlight": plant.sunlight + growth.sunlight,
            "water": plant.water + growth.water,
            "fertilizer": plant.fertilizer + growth.fertilizer,
        }
    )
