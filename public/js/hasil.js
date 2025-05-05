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
    window.kriteriaValueDetail.length = 0; // Clear previous data
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
    groupedData = null;
    await fetchData().then(() => {
        const container = document.getElementById("hasil-container");
        container.innerHTML = "";

        if (window.kriteriaValueDetail.length === 0) {
            container.innerHTML =
                '<p class="text-center text-gray-600">Please add Alternatif and Kriteria data to see the calculation.</p>';
            return;
        }
        // Group data by alternatif_id
        groupedData = window.kriteriaValueDetail.reduce((accumulator, item) => {
            if (!accumulator[item.alternatif_id]) {
                accumulator[item.alternatif_id] = {
                    alternatif: { ...item.alternatif }, // Clone the alternatif object
                    values: [],
                };
            }
            accumulator[item.alternatif_id].values.push(item);
            return accumulator;
        }, {});

        // Update alternatif names dynamically
        Object.values(groupedData).forEach((group) => {
            const updatedAlternatif = window.kriteriaValueDetail.find(
                (item) => item.alternatif_id === group.alternatif.alternatif_id
            )?.alternatif;
            if (updatedAlternatif) {
                // alert("Generating Hasil Table...");
                group.alternatif.nama = updatedAlternatif.nama;
            }
        });

        // Normalize weights (Bobot) for WP method
        const totalWeight = Object.values(groupedData)[0].values.reduce(
            (sum, item) => sum + parseFloat(item.kriteria.bobot),
            0
        );

        // Calculate weighted powers for each alternatif
        weightedPowers = Object.values(groupedData).map((alt) => {
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
                alternatif: alt.alternatif.nama,
                score: product,
            };
        });

        // Sort descending by score
        weightedPowers.sort((a, b) => b.score - a.score);

        // Build normalized weight table
        const weightTable = document.createElement("table");
        weightTable.className =
            "w-full bg-white rounded shadow text-center mt-4";
        weightTable.innerHTML = "";

        // Table header for normalized weights
        const weightThead = document.createElement("thead");
        const weightHeaderRow = document.createElement("tr");
        weightHeaderRow.innerHTML = `
            <th class="border px-4 py-2">Kriteria</th>
            <th class="border px-4 py-2">Bobot</th>
            <th class="border px-4 py-2">Normalized Weight</th>
        `;
        weightThead.appendChild(weightHeaderRow);
        weightTable.appendChild(weightThead);

        // Table body for normalized weights
        const weightTbody = document.createElement("tbody");
        Object.values(groupedData)[0].values.forEach((item) => {
            const tr = document.createElement("tr");
            const weight = parseFloat(item.kriteria.bobot);
            const normalizedWeight = weight / totalWeight;
            tr.innerHTML = `
                <td class="border px-4 py-2">${item.kriteria.nama}</td>
                <td class="border px-4 py-2">${weight.toFixed(6)}</td>
                <td class="border px-4 py-2">${normalizedWeight.toFixed(6)}</td>
            `;
            weightTbody.appendChild(tr);
        });
        weightTable.appendChild(weightTbody);

        // Create and append the heading for normalized weights
        const heading = document.createElement("h4");
        heading.className = "text-2xl font-bold text-center";
        heading.textContent = "Bobot yang di Normalisasi";
        container.appendChild(heading);
        // Append normalized weight table to the container
        container.appendChild(weightTable);

        // Build table
        const table = document.createElement("table");
        table.className = "w-full bg-white rounded shadow text-center";
        table.innerHTML = "";
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
        //hasil table
        const heading2 = document.createElement("h4");
        heading2.className = "text-2xl font-bold text-center";
        heading2.textContent = "Hasil Perhitungan WP";
        container.appendChild(heading2);
        container.appendChild(table);
    });
}

document.addEventListener("DOMContentLoaded", generateHasilTable);
