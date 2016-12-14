<?php
		$sessionid = $_POST['ses'];
		$name = $_POST['name'];
		$shortde = $_POST['sh'];
		$longde = $_POST['lo'];
		$emailid = $_POST['em'];

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

		$sql = "INSERT INTO tickets (session, name, shortdesc, longdesc, email)
		VALUES ('$sessionid', '$name', '$shortde', '$longde', '$emailid');"; 

		

		if ($conn->query($sql) === TRUE) 
		{
			echo "Your Ticket ID is : " .$sessionid;
		}
		else 
		{
    		echo "Error: " . $sql . "<br>" . $conn->error;
		}

		$conn->close();
?>