<?php
		$name = $_POST['name'];
		$email = $_POST['em'];
		$shortde = $_POST['sh'];
		$longde = $_POST['lo'];

		$servername = "localhost";
		$username = "root";
		$password = "";
		$dbname = "dialog";

		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		} 

		$sql = "INSERT INTO tickets (name, shortdesc, longdesc)
		VALUES ('$name', '$shortde', '$longde');";

		$sql .= "SELECT LAST_INSERT_ID();";

		if ($conn->multi_query($sql) === TRUE) 
		{
			$result = $conn->store_result(); // $conn->query($getid);
			$conn->next_result();
			$result = $conn->store_result();
			$row = $result->fetch_row();

			echo "Your Ticket ID is : " .$row[0];
		}
		else 
		{
    		echo "Error: " . $sql . "<br>" . $conn->error;
		}

		$conn->close();
?>