const highScoresList = document.getElementById("highScoresList");
const clearScoresBtn = document.getElementById("clearScores");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores
  .map(score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");


clearScoresBtn.addEventListener("click", () => {
  localStorage.removeItem("highScores");
  highScoresList.innerHTML = "";
});







