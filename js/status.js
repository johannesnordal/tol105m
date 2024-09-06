window.addEventListener("load", (event) => {
    $.getJSON("/data/status.json", init);
});

function passedIcon(passed) {
    if (passed !== undefined) {
        var color = passed ? 'green' : 'red';
    } else {
        var color = 'grey';
    }
    return `<i class="fa fa-solid fa-circle" style="color: ${color}"></i>`;
}

function addTableElement(tableBody, system, software, passed) {
    tableBody.append(`
    <tr>
        <td>${system}</td>
        <td>${software}</td>
        <td>${passedIcon(passed)}</td>
    </tr>
    `);
}

function init(data) {
    let tableBody = $("#table-body");
    $.each(data, (system, software_list) => {
        $.each(software_list, (software, value) => {
            addTableElement(tableBody, system, software, value.passed);
        });
    });
}
