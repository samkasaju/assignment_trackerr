document.addEventListener('DOMContentLoaded', () => {
    fetchAssignments();

    const form = document.getElementById('assignmentForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('assignment_tracker.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                fetchAssignments();
                form.reset();
            }
        });
    });
});

function fetchAssignments() {
    fetch('assignment_tracker.php')
        .then(response => response.json())
        .then(data => {
            const pendingList = document.getElementById('pendingAssignments');
            const completedList = document.getElementById('completedAssignments');

            pendingList.innerHTML = '';
            completedList.innerHTML = '';

            data.forEach(assignment => {
                const li = document.createElement('li');
                li.textContent = `${assignment.title} - ${assignment.due_date}`;

                if (assignment.status === 'completed') {
                    li.classList.add('completed');
                    completedList.appendChild(li);
                } else {
                    const completeButton = document.createElement('button');
                    completeButton.textContent = 'Mark as Complete';
                    completeButton.addEventListener('click', () => {
                        updateAssignmentStatus(assignment.id, 'completed');
                    });
                    li.appendChild(completeButton);
                    pendingList.appendChild(li);
                }
            });
        });
}

function updateAssignmentStatus(id, status) {
    fetch('assignment_tracker.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `id=${id}&status=${status}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            fetchAssignments();
        }
    });
}
