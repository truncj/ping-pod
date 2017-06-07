package main

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
)

func EnvHandler(rw http.ResponseWriter, req *http.Request) {
	fmt.Printf("%s\n", "EnvHandler was called")
	environment := make(map[string]string)
	for _, item := range os.Environ() {
		splits := strings.Split(item, "=")
		key := splits[0]
		val := strings.Join(splits[1:], "=")
		environment[key] = val
	}
	//ex := os.Executable()
	//environment["executable binary"] = ex
	pid := strconv.Itoa(os.Getpid())
	ppid := strconv.Itoa(os.Getppid())
	environment["PID"] = pid
	environment["PPID"] = ppid

	ifaces, err := net.Interfaces()
	if err != nil {
		fmt.Printf("%s\n", err)
	}
	for _, i := range ifaces {
		addrs, err := i.Addrs()
		if err != nil {
			fmt.Printf("%s\n", err)
		}
		for _, addr := range addrs {
			var ip net.IP
			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
				environment["IPNET"] = ip.String()
				ipv4 := ip.To4()
				if ipv4 != nil {
					environment["IPNETv4"] = ipv4.String()
				}
			case *net.IPAddr:
				ip = v.IP
				environment["IPAddr"] = ip.String()
				ipv4 := ip.To4()
				if ipv4 != nil {
					environment["IPAddrv4"] = ipv4.String()
				}
			}
		}
	}

	envJSON := HandleError(json.MarshalIndent(environment, "", "  ")).([]byte)
	rw.Write(envJSON)
}

func HandleError(result interface{}, err error) (r interface{}) {
	if err != nil {
		panic(err)
	}
	return result
}

func PingCommands(rw http.ResponseWriter, req *http.Request) {
	fmt.Printf("%s\n", "PingCommands was called")
	ip := mux.Vars(req)["ip"]
	out, err := exec.Command("ping", ip, `-c 3`).Output()

	if strings.Contains(string(out), " 0.0% packet loss") {
		rw.Write([]byte("Success"))
	} else {
		rw.Write([]byte("Failure"))
	}

	if err != nil {
		fmt.Printf("Failure")
	}
}

func main() {
	r := mux.NewRouter()
	r.Path("/env").Methods("GET").HandlerFunc(EnvHandler)
	r.Path("/ping/{ip}").Methods("GET").HandlerFunc(PingCommands)

	n := negroni.Classic()
	n.UseHandler(r)
	n.Run(":3000")
}
