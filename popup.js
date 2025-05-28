const knifeTypes = [
  "Bayonet",
  "Karambit",
  "Butterfly Knife",
  "M9 Bayonet",
  "Flip Knife",
  "Huntsman Knife",
  "Shadow Daggers",
  "Falchion Knife",
  "Gut Knife",
  "Navaja Knife",
  "Stiletto Knife",
  "Talon Knife",
  "Ursus Knife",
  "Survival Knife",
  "Paracord Knife",
  "Nomad Knife",
  "Skeleton Knife"
];

const knifeSkins = [
  "Doppler",
  "Fade",
  "Lore",
  "Crimson Web",
  "Tiger Tooth",
  "Slaughter",
  "Marble Fade",
  "Damascus Steel",
  "Case Hardened",
  "Ultraviolet",
  "Night",
  "Rust Coat",
  "Blue Steel"
];

// Fyll dropdowns
const knifeTypeSelect = document.getElementById("knifeType");
const knifeSkinSelect = document.getElementById("knifeSkin");

knifeTypes.forEach(type => {
  const opt = document.createElement("option");
  opt.value = type;
  opt.textContent = type;
  knifeTypeSelect.appendChild(opt);
});

knifeSkins.forEach(skin => {
  const opt = document.createElement("option");
  opt.value = skin;
  opt.textContent = skin;
  knifeSkinSelect.appendChild(opt);
});

// Sök-funktion
function searchKnife() {
  const type = knifeTypeSelect.value;
  const skin = knifeSkinSelect.value;
  const combo = `${type} | ${skin}`;
  document.getElementById("result").textContent = `Du söker: ${combo}`;

  // Här kan du koppla detta till sökning på din hemsida
  // t.ex. sökPåWebbsida(combo); 
}
