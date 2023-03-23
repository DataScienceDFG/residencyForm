let count = 1;
const startInput1 = document.getElementById("startDate1");
const endInput1 = document.getElementById("endDate1");
const numDaysInput1 = document.getElementById("numDays1");
const sum_of_days = document.getElementById("sum_of_days");

startInput1.addEventListener("change", function () {
  calculateDays(startInput1, endInput1, numDaysInput1);
});

endInput1.addEventListener("change", function () {
  calculateDays(startInput1, endInput1, numDaysInput1);
});

numDaysInput1.addEventListener("change", function () {
  calculateSumDays();
});

function addRow() {
  count++;
  const table = document.getElementById("myTable");
  const row = table.insertRow(-1);
  const countryCell = row.insertCell(0);
  const startCell = row.insertCell(1);
  const endCell = row.insertCell(2);
  const numDaysCell = row.insertCell(3);
 
  countryCell.innerHTML = `<input type="text" id="country${count}" class = "dropdown">`;
  startCell.innerHTML = `<input type="date" id="startDate${count}" class = "dropdown">`;
  endCell.innerHTML = `<input type="date" id="endDate${count}"class = "dropdown">`;
  numDaysCell.innerHTML = `<input type="text" id="numDays${count}"class = "dropdown" readonly>`;

  const startInput = document.getElementById(`startDate${count}`);
  const endInput = document.getElementById(`endDate${count}`);
  const numDaysInput = document.getElementById(`numDays${count}`);

  startInput.addEventListener("change", function () {
    calculateDays(startInput, endInput, numDaysInput);
  });

  endInput.addEventListener("change", function () {
    calculateDays(startInput, endInput, numDaysInput);
  });

  numDaysInput.addEventListener("change", function () {
    calculateSumDays();
  });
}

function calculateSumDays(daysCount) {
  let totalDays = 0;
  for (let index = 1; index <= count; index++) {
    const numDaysInput = document.getElementById(`numDays${index}`);
    totalDays += (parseInt(numDaysInput.value) || 0);
  }
  sum_of_days.value = totalDays;
}

function calculateDays(startInput, endInput, numDaysInput) {
  const startDate = new Date(startInput.value);
  const endDate = new Date(endInput.value);

  const totalDays = Math.ceil(
    Math.abs(endDate.getTime() + 86400000 - startDate.getTime()) /
      (1000 * 3600 * 24)
  );

  let weekendDays = 0;
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    if (date.getDay() === 6 || date.getDay() === 0) {
      weekendDays++;
    }
  }

  numDaysInput.value = totalDays;
  let evt = new CustomEvent('change');
  numDaysInput.dispatchEvent(evt);
}

document.getElementById("savePdfBtn").addEventListener("click", function () {
  function calculateNoOfDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let businessDays = 0;
    while (start <= end) {
      const dayOfWeek = start.getDay();
      businessDays++;
      start.setDate(start.getDate() + 1);
    }
    return businessDays;
  }

  const pdf = new jsPDF();
  const mode_of_study = document.getElementById("mode_of_study").value;
  const category = document.getElementById("category").value;
  const country_of_study = document.getElementById("country_of_study").value;

  const table = document.getElementById("myTable");
  const columns = [
    { header: "Country", dataKey: "country" },
    { header: "Number of Days", dataKey: "noOfDays" },
  ];

  const rows = [];
  let totalDays = 0;
  for (let i = 1; i < table.rows.length; i++) {
    const country = table.rows[i].cells[0].firstChild.value;
    const startDate = table.rows[i].cells[1].firstChild.value;
    const endDate = table.rows[i].cells[2].firstChild.value;
    const noOfDays = calculateNoOfDays(startDate, endDate);
    totalDays += noOfDays;
    rows.push({country, noOfDays });
  }
  sum_of_days.value = totalDays;
  const totaldays = totalDays;
  const tableOptions = {
    startY: 75,
    margin: { top: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnWHeight: 100,
    bodyStyles: { textColor: 0, cellHeight: 50 },
    columnStyles: {

      country: { cellWidth: 60 },
      noOfDays: { cellWidth: 40 },
    },
  };

  pdf.addImage(imgData, "PNG", 5, 5, 35, 14);
  pdf.autoTable(columns, rows, tableOptions);
  pdf.setFontSize(22);
  pdf.text(80, 25, "Residency Calculator");
  pdf.setFontSize(16);
  pdf.text(20, 50, "Mode of study");
  pdf.text(20, 60, mode_of_study);
  pdf.text(80, 50, "Category");
  pdf.text(80, 60, category);
  pdf.text(140, 50, "Country of study");
  pdf.text(140, 60, country_of_study);
  pdf.rect(19, 55, 38, 6);
  pdf.rect(79, 55, 38, 6);
  pdf.rect(139, 55, 44, 6);
  pdf.text(
    `Total number of days: ${totaldays}`,
    14,
    pdf.autoTable.previous.finalY + 10
  );

  pdf.autoTable(pdf.autoTable);

  pdf.save("table.pdf");
});
