# all cookies received will be stored in the session object
s = requests.Session()

# authenticate with the api to get the jwt cookie. this will be valid for a maximum of one hour
payload={'username'=<username>,'password'=<password>}
s.post('http://example.com/api/auth/login',data=payload)

# using the same session, make subsequent queries
players = s.get('http://example.com/api/players/smp').json()