document.addEventListener("DOMContentLoaded", () => {
  fetchJobs();

  document.getElementById("jobForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const job = {
      company: document.getElementById("company").value,
      title: document.getElementById("title").value,
      date: document.getElementById("date").value,
      status: document.getElementById("status").value,
      link: document.getElementById("link").value
    };
    const res = await fetch("http://localhost:5000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job)
    });
    if (res.ok) {
      addJobToTable(job);
      document.getElementById("jobForm").reset();
    }
  });

  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      const status = button.getAttribute("data-status");
      filterJobs(status);
    });
  });
});

async function fetchJobs() {
  const res = await fetch("http://localhost:5000/jobs");
  const jobs = await res.json();
  jobs.forEach(addJobToTable);
}

function addJobToTable(job) {
  const row = document.createElement("tr");
  const statusClass = `status-${job.status.toLowerCase()}`;
  row.innerHTML = `
    <td>${job.company}</td>
    <td>${job.title}</td>
    <td>${job.date}</td>
    <td><span class="status-badge ${statusClass}">${job.status}</span></td>
    <td><a href="${job.link}" target="_blank">View</a></td>
  `;
  document.querySelector("#jobTable tbody").appendChild(row);
}

function filterJobs(status) {
  const rows = document.querySelectorAll("#jobTable tbody tr");
  rows.forEach(row => {
    const rowStatus = row.querySelector(".status-badge").textContent.trim().toLowerCase();
    if (status.toLowerCase() === "all" || rowStatus === status.toLowerCase()) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
