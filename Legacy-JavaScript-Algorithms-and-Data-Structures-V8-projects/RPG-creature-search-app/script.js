const searchBtn = document.getElementById("search-button");
const searchIn = document.getElementById("search-input");

// Wichtig: genau dieses Endpoint-Pattern
const API_BASE = "https://rpg-creature-api.freecodecamp.rocks/api/creature";

// UI mit Creature-Daten füllen
function fillUI(data) {
  // Name + ID
  document.getElementById("creature-name").textContent = data.name.toUpperCase();
  document.getElementById("creature-id").textContent = `#${data.id}`;

  // Gewicht / Größe
  document.getElementById("weight").textContent = `Weight: ${data.weight}`;
  document.getElementById("height").textContent = `Height: ${data.height}`;

  // Bild (API hat evtl. kein Sprite – Tests verlangen das auch nicht zwingend)
  const sprite = document.getElementById("sprite");
  if (data.sprites && data.sprites.front_default) {
    sprite.src = data.sprites.front_default;
    sprite.alt = data.name;
  } else {
    sprite.src = "";
    sprite.alt = "";
  }

  // Typen – API liefert: types: [{ "name": "fire" }, ...]
  const typesElement = document.getElementById("types");
  typesElement.innerHTML = ""; // MUSS zwischen Suchen geleert werden

  if (Array.isArray(data.types)) {
    data.types.forEach((t) => {
      const typeName = String(t.name).toUpperCase(); // z.B. FIRE, WATER, ROCK
      const span = document.createElement("span");
      span.textContent = typeName;
      span.classList.add(`type-${typeName.toLowerCase()}`);
      span.style.padding = "8px 20px";
      span.style.borderRadius = "12px";
      typesElement.appendChild(span);
    });
  }

  // Stats – API liefert: stats: [{ "base_stat": 65, "name": "hp" }, ...]
  const getStat = (name) => {
    const statObj = data.stats.find((s) => s.name === name);
    return statObj ? statObj.base_stat : "";
  };

  document.getElementById("hp").textContent = getStat("hp");
  document.getElementById("attack").textContent = getStat("attack");
  document.getElementById("defense").textContent = getStat("defense");
  document.getElementById("special-attack").textContent = getStat("special-attack");
  document.getElementById("special-defense").textContent = getStat("special-defense");
  document.getElementById("speed").textContent = getStat("speed");
}

// Suchen nach Name oder ID
async function searchCreature() {
  const rawValue = searchIn.value.trim();
  if (!rawValue) return;

  // API ist case-insensitive beim Namen – wir schicken alles in lowercase
  const param = rawValue.toLowerCase();

  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(param)}`);

    if (!res.ok) {
      throw new Error("Creature not found");
    }

    const data = await res.json();
    fillUI(data);
  } catch (err) {
    // Für die Tests muss der Text GENAU so lauten:
    alert("Creature not found");
  }
}

// Events
searchBtn.addEventListener("click", searchCreature);

searchIn.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchCreature();
  }
});
