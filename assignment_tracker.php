<?php
$host = 'localhost';
$user = 'root'; 
$password = ''; 
$dbname = 'assignment_tracker'; 

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $description = $_POST['description'];
    $due_date = $_POST['due_date'];

    $stmt = $conn->prepare("INSERT INTO assignments (title, description, due_date) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $title, $description, $due_date);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['status' => 'success']);
    exit();
}

// Handle fetching assignments
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM assignments");

    $assignments = [];
    while ($row = $result->fetch_assoc()) {
        $assignments[] = $row;
    }

    echo json_encode($assignments);
    exit();
}

// Handle updating assignment status
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT);

    $id = $_PUT['id'];
    $status = $_PUT['status'];

    $stmt = $conn->prepare("UPDATE assignments SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['status' => 'success']);
    exit();
}

$conn->close();
?>

