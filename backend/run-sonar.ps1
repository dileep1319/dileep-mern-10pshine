# Load token from .env
$env:SONAR_TOKEN = ((Get-Content .env | Select-String 'SONAR_TOKEN=').ToString().Split('=')[1]).Trim()

# Run Sonar Scanner
npx sonar-scanner "-Dsonar.token=$Env:SONAR_TOKEN"
