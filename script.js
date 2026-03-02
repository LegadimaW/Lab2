const input = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const bordersSection = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    if (!countryName) return;

    try {
        // Reset UI
        errorMessage.classList.add('hidden');
        countryInfo.classList.add('hidden');
        bordersSection.classList.add('hidden');

        // Show loading
        spinner.classList.remove('hidden');

        // Fetch main country
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        // Display country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;
        countryInfo.classList.remove('hidden');

        // Border countries
        bordersSection.innerHTML = "";

        if (country.borders) {
            for (let code of country.borders) {
                const borderRes = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderRes.json();
                const border = borderData[0];

                const div = document.createElement("div");
                div.classList.add("border-country");

                div.innerHTML = `
                    <p>${border.name.common}</p>
                    <img src="${border.flags.svg}">
                `;

                bordersSection.appendChild(div);
            }

            bordersSection.classList.remove('hidden');
        } else {
            bordersSection.innerHTML = "<p>No bordering countries.</p>";
            bordersSection.classList.remove('hidden');
        }

    } catch (error) {
        errorMessage.textContent = "Error: " + error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        spinner.classList.add('hidden');
    }
}

// Button click
searchBtn.addEventListener('click', () => {
    searchCountry(input.value.trim());
});

// Press Enter
input.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        searchCountry(input.value.trim());
    }
});