// FORMULAR 1 – Reading anfordern

const API_URL = "https://psyche.westeurope.cloudapp.azure.com";

document
  .getElementById("readingForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitButton = document.querySelector("#readingForm button");
    const loader = document.getElementById("loader");
    const successMessage = document.getElementById("success");

    submitButton.disabled = true;
    loader.style.display = "block";
    successMessage.style.display = "none";

    const data = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      externalId: document.getElementById("externalId").value.trim(),
      birthdate: document.getElementById("birthdate").value.trim(),
      birthtime: document.getElementById("birthtime").value.trim(),
      timezone: document.getElementById("timezone").value.trim(),
      language: document.getElementById("language").value.trim(),
      email: document.getElementById("email").value.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/api/reading`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Fehler beim Versenden");

      successMessage.style.display = "block";
      // Optional: document.getElementById("readingForm").reset();
    } catch (error) {
      console.error("Fehler:", error);
      alert("Ein Fehler ist aufgetreten. Bitte erneut versuchen.");
    } finally {
      submitButton.disabled = false;
      loader.style.display = "none";
    }
  });

// FORMULAR 2 – Zeitzone anhand Geburtsort suchen
document
  .getElementById("timezoneForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const loader = document.getElementById("timezoneLoader");
    const resultBox = document.getElementById("timezoneResults");
    const location = document.getElementById("birthPlace").value.trim();

    loader.style.display = "block";
    resultBox.innerHTML = "";

    try {
      const response = await fetch(`${API_URL}/api/timezone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) throw new Error("Fehler bei der Zeitzonen-Suche");

      const results = await response.json();

      if (!results || results.length === 0) {
        resultBox.innerHTML = "<p>Keine Ergebnisse gefunden.</p>";
        return;
      }

      const list = document.createElement("ul");

      results.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${item.value}</strong>
            <small>Zeitzone: ${item.timezone}</small>
            <small>Land: ${item.country}</small>
          `;
        list.appendChild(li);
      });

      resultBox.appendChild(list);
    } catch (error) {
      console.error(error);
      resultBox.innerHTML = "<p>Es ist ein Fehler aufgetreten.</p>";
    } finally {
      loader.style.display = "none";
    }
  });
