window.kriteriaValueDetail = [];

async function fetchKriteriaValueDataDetailById(id) {
    try {
        const response = await fetch(`/api/kriteria-value-detail/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error("Error fetching kriteria data:", error);
    }
}

async function fetchData() {
    const kriteriaData = await fetchKriteriaValueDataByUser();

    await Promise.all(
        kriteriaData.map(async (k) => {
            const data = await fetchKriteriaValueDataDetailById(
                k.kriteria_value_id
            );
            window.kriteriaValueDetail.push(data);
        })
    );
}

async function generateHasilTable() {
    await fetchData().then(() => {
        console.log("kriteriaValueDetail", window.kriteriaValueDetail);
        const container = document.getElementById("hasil-container");
        container.innerHTML = "";

        if (window.kriteriaValueDetail.length === 0) {
            container.innerHTML =
                '<p class="text-center text-gray-600">Please add Alternatif and Kriteria data to see the calculation.</p>';
            return;
        }

        // Group data by alternatif_id
        const groupedData = window.kriteriaValueDetail.reduce((acc, item) => {
            if (!acc[item.alternatif_id]) {
                acc[item.alternatif_id] = {
                    alternatif: item.alternatif,
                    values: [],
                };
            }
            acc[item.alternatif_id].values.push(item);
            return acc;
        }, {});

        // Normalize weights (Bobot) for WP method
        const totalWeight = Object.values(groupedData)[0].values.reduce(
            (sum, item) => sum + parseFloat(item.kriteria.bobot),
            0
        );

        // Calculate weighted powers for each alternatif
        const weightedPowers = Object.values(groupedData).map((alt) => {
            let product = 1;
            alt.values.forEach((item) => {
                const weight = parseFloat(item.kriteria.bobot) / totalWeight;
                const value = parseFloat(item.value) || 1; // fallback 1 if no value
                const power =
                    item.kriteria.tipe.toLowerCase() === "cost"
                        ? -weight
                        : weight;
                product *= Math.pow(value, power);
            });
            return {
                alternatif: alt.alternatif.name,
                score: product,
            };
        });

        // Sort descending by score
        weightedPowers.sort((a, b) => b.score - a.score);

        // Build table
        const table = document.createElement("table");
        table.className = "w-full bg-white rounded shadow text-center";

        // Table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
        <th class="border px-4 py-2">Rank</th>
        <th class="border px-4 py-2">Alternatif</th>
        <th class="border px-4 py-2">Score (WP)</th>
          `;
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Table body
        const tbody = document.createElement("tbody");
        weightedPowers.forEach((item, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
          <td class="border px-4 py-2">${index + 1}</td>
          <td class="border px-4 py-2">${item.alternatif}</td>
          <td class="border px-4 py-2">${item.score.toFixed(6)}</td>
        `;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        container.appendChild(table);
    });
}

document.addEventListener("DOMContentLoaded", generateHasilTable);
