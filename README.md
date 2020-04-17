This is a simple project used in one of my talks to present the difference between Http 1 against Http 2

# Requirements
- Node >= 10.9
- Yarn >= 1.22.4

# Setup
```bash
$ yarn install
```

# Running

```bash
$ yarn start
```

# Recommendations

To see the difference, you should open your browser inspector and simulate a 3G or lower internet connection

- HTTP 1.1: `http://localhost:300`
- HTTP 2: `https://localhost:3443`
	- its important to use `https` in the h2 route
	- there is a self signed certificate in the project