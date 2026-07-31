#!/usr/bin/env python3
"""Prepare generated papercraft artwork for the interactive town.

The source images use a nearly-uniform paper backdrop that is close in colour to
the cream building walls.  A global chroma key therefore damages the artwork.
This script flood-fills only background pixels connected to the canvas edge,
then feathers and crops the resulting alpha channel.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "呆猫小镇视觉"
TARGET = ROOT / "public" / "assets" / "town" / "papercraft"

ASSETS = {
    "Isometric Adventurers Guild Building Asset.png": "guild.png",
    "Isometric Community Workshop Building Asset.png": "project-workshop.png",
    "Isometric Creative Media Studio Asset.png": "project-studio.png",
    "Isometric Local-Market Project Shop Asset.png": "project-market.png",
    "Isometric Technology Project Laboratory Asset.png": "project-lab.png",
    "Isometric Public Community Hall Asset.png": "community-hall.png",
    "Isometric Completed-Project Memorial Pavilion Asset.png": "project-memorial.png",
    "C1 Creative Skill Stall Asset.png": "skill-creative.png",
    "C2 Technology Skill Stall Asset.png": "skill-tech.png",
    "C3 Operations Business Skill Stall Asset.png": "skill-operations.png",
}


def remove_connected_background_image(rgb: Image.Image, target: Path, threshold: int = 28) -> None:
    rgb = rgb.convert("RGB")
    marker = rgb.copy()
    fill = (255, 0, 255)
    draw = ImageDraw.Draw(marker)
    width, height = marker.size

    # Several border seeds make the method robust to gentle lighting gradients.
    seeds = {
        (0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1),
        (width // 2, 0), (width // 2, height - 1),
        (0, height // 2), (width - 1, height // 2),
    }
    for seed in seeds:
        if marker.getpixel(seed) != fill:
            ImageDraw.floodfill(marker, seed, fill, thresh=threshold)

    marker_array = np.asarray(marker)
    background = np.all(marker_array == np.array(fill, dtype=np.uint8), axis=2)
    delta = Image.fromarray(np.where(background, 0, 255).astype(np.uint8), "L")

    # Soften only the cut edge; the illustration remains crisp.
    alpha = delta.filter(ImageFilter.GaussianBlur(1.2))
    rgba = rgb.convert("RGBA")
    rgba.putalpha(alpha)
    bbox = alpha.getbbox()
    if not bbox:
        raise RuntimeError(f"No foreground detected in {source.name}")
    padding = 28
    bbox = (
        max(0, bbox[0] - padding),
        max(0, bbox[1] - padding),
        min(width, bbox[2] + padding),
        min(height, bbox[3] + padding),
    )
    cropped = rgba.crop(bbox)
    max_side = 1280
    scale = min(1.0, max_side / max(cropped.size))
    if scale < 1:
        cropped = cropped.resize(
            (round(cropped.width * scale), round(cropped.height * scale)),
            Image.Resampling.LANCZOS,
        )
    target.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(target, optimize=True)
    print(f"created {target.relative_to(ROOT)} {cropped.size}")


def remove_connected_background(source: Path, target: Path, threshold: int = 28) -> None:
    remove_connected_background_image(Image.open(source), target, threshold)


def main() -> None:
    for source_name, target_name in ASSETS.items():
        remove_connected_background(SOURCE / source_name, TARGET / target_name)

    prop_sheets = {
        "C4 Environment Props Sheet 1.png": [
            "notice-board", "lamp", "bench",
            "mailbox", "parcels", "planter",
        ],
        "C5 Environment Props Sheet 2.png": [
            "signpost", "tree", "shrub",
            "produce-crate", "fountain", "bridge",
        ],
    }
    for source_name, prop_names in prop_sheets.items():
        sheet = Image.open(SOURCE / source_name).convert("RGB")
        cell_width = sheet.width // 3
        cell_height = sheet.height // 2
        for index, prop_name in enumerate(prop_names):
            column = index % 3
            row = index // 3
            crop = sheet.crop((
                column * cell_width,
                row * cell_height,
                sheet.width if column == 2 else (column + 1) * cell_width,
                sheet.height if row == 1 else (row + 1) * cell_height,
            ))
            remove_connected_background_image(crop, TARGET / f"prop-{prop_name}.png", 28)


if __name__ == "__main__":
    main()
