document.addEventListener('DOMContentLoaded', async function() {
    const matchesContainer = document.getElementById('matches-container');
    const matchDetails = document.getElementById('match-details');
    const detailsContent = document.getElementById('details-content');
    const backButton = document.getElementById('back-button');


    const loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('spinner');
    matchesContainer.appendChild(loadingSpinner);

    await fetchMatches();  

    async function fetchMatches() {
        loadingSpinner.style.display = 'block';

        try {
            const response = await fetch('https://api.openligadb.de/getmatchdata/bl3/2024/4');
            if (!response.ok) throw new Error('Failed to fetch data');
            const matches = await response.json();            displayMatches(matches);
        } catch (error) {
            console.error('Error fetching match data:', error);
            matchesContainer.innerHTML = '<p class="error">Failed to load match data. Please try again later.</p>';
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    function displayMatches(matches) {
        matchesContainer.innerHTML = ''; 
        matches.forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            matchCard.innerHTML = `
                <div class="team-logos">
                    <img src="${match.team1.teamIconUrl}" alt="${match.team1.teamName}">
                    <img src="${match.team2.teamIconUrl}" alt="${match.team2.teamName}">
                </div>
                <h3>${match.team1.shortName} vs ${match.team2.shortName}</h3>
                <p>${new Date(match.matchDateTime).toLocaleString()}</p>
            `;
            matchCard.addEventListener('click', () => {
                displayMatchDetails(match);
                matchCard.classList.add('selected');
            });
            matchesContainer.appendChild(matchCard);
        });
    }

    function displayMatchDetails(match) {
        matchDetails.classList.remove('hidden');
        matchesContainer.classList.add('hidden');
        detailsContent.innerHTML = `
            <h2>${match.team1.teamName} vs ${match.team2.teamName}</h2>
            <div class="team-logos">
                <img src="${match.team1.teamIconUrl}" alt="${match.team1.teamName}">
                <img src="${match.team2.teamIconUrl}" alt="${match.team2.teamName}">
            </div>
            <p><strong>Date:</strong> ${new Date(match.matchDateTime).toLocaleString()}</p>
            <p><strong>League:</strong> ${match.leagueName}</p>
            <p><strong>Group:</strong> ${match.group.groupName}</p>
        `;
        matchDetails.style.backgroundColor = match.winner ? '#1c1c1c' : '#333333';
    }

    backButton.addEventListener('click', () => {
        matchDetails.classList.add('hidden');
        matchesContainer.classList.remove('hidden');
        document.querySelectorAll('.match-card').forEach(card => card.classList.remove('selected'));
    });

    // Auto-refresh matches every 15 minutes using async function in setInterval
    setInterval(fetchMatches, 900000);
});