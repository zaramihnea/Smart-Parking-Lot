import socket

def serverProgram():
	host = socket.gethostname()
	port = 5000
	serverSocket = socket.socket()
	serverSocket.bind((host, port))
	serverSocket.listen(1)
	conn, address = serverSocket.accept()
	print("Connection from " + str(address))
	while True:
		data = conn.recv(1024).decode()
		print(str(data))

if __name__ == '__main__':
	serverProgram()
