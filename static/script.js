const submitButton = document.getElementById('submitbutton');
const logOutButton = document.getElementById('logoutbutton');
let authToken = null;

const getTokenFromEndpoint = async () => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    const credentials = btoa(`${username.value}:${password.value}`);

    try {
        const response = await fetch('https://01.kood.tech/api/auth/signin', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${credentials}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            authToken = data;
            //console.log('Authentication successful. JWT: ' + authToken);
            await getDataFromGraphql(authToken)

            // Display user data section and hide login form after successful authentication
            document.getElementById('loginFormContainer').style.display = 'none';
            document.getElementById('container').style.display = 'flex';
            logOutButton.style.display = 'block';
        } else {
            const error = await response.json()
            console.error('Authentication failed');
            alert(error.error);
        }
    } catch (error) {
        console.error('Error occurred during authentication: ', error);
        alert('An error occurred during authentication. Please try again.');
    }
};


const getDataFromGraphql = async (token) => {
    let results = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
        method: 'POST',

        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `{
            user{
              id
              attrs
              auditRatio
              totalUp
              totalDown
              transactions(order_by: { createdAt: desc }) {
                id
                type
                amount
                createdAt
                path
              }
            }
          }`
        })
    })
    if (results.ok) {
        const userData = await results.json();
        console.log('User data: ', userData);
        // Process the retrieved data and populate the UI
        populateUserData(userData)
        auditRatioGraph(userData)
        progressOT(userData);
    } else {
        console.error('Failed to fetch user data');
        // Handle error fetching user data
    }
};

function progressOT(userData) {
    const xpOverTimeGraph = document.getElementById('xpOverTimeGraph');
    const user = userData.data.user[0];
    const excludedPaths = ["/johvi/div-01/piscine-js/", "/johvi/piscine-go"];
    const progressSvg = progressOverTime(user.transactions
        .filter(transaction => transaction.type === 'xp' && !excludedPaths.some(exPath => transaction.path.startsWith(exPath)))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)))

    xpOverTimeGraph.innerHTML = progressSvg.trim();
}

function progressOverTime(data) {
    const width = 600;
    const height = 400;
    const timestamps = data.map(t => new Date(t.createdAt).getTime());

    const minX = Math.min(...timestamps);
    const maxX = Math.max(...timestamps);
    const maxY = Math.max(...data.map(t => t.amount));

    const scaleX = (time) => (time - minX) / (maxX - minX) * width;
    const scaleY = (amount) => height - (amount / maxY) * height;

    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

    // Draw lines between points and include timestamps
    for (let i = 0; i < data.length - 1; i++) {
        const currentTimestamp = new Date(data[i].createdAt).toLocaleDateString();
        const nextTimestamp = new Date(data[i + 1].createdAt).toLocaleDateString();

        svgContent += `
            <line x1="${scaleX(timestamps[i])}" y1="${scaleY(data[i].amount)}"
                  x2="${scaleX(timestamps[i + 1])}" y2="${scaleY(data[i + 1].amount)}"
                  stroke="blue" stroke-width="2">
                <title>${currentTimestamp}</title>
            </line>
        `;

        svgContent += `
            <text x="${scaleX(timestamps[i])}" y="${scaleY(data[i].amount) - 5}" font-size="10" text-anchor="middle">${currentTimestamp}</text>
        `;
    }

    svgContent += `</svg>`;
    return svgContent;
}

const getUserTotalXP = (user) => {
    let totalXP = 0;
    const excludedPaths = ["/johvi/div-01/piscine-js/", "/johvi/piscine-go"];
    user.transactions.forEach(transaction => {
        if (transaction.type === 'xp' && !excludedPaths.some(exPath => transaction.path.startsWith(exPath))) {
            totalXP += transaction.amount;
        }
    });
    return totalXP/1000;
};

const populateUserData = (userData) => {
    const user = userData.data.user[0];
    // Populate user data into HTML elements
    document.getElementById('userName').textContent = `${user.attrs.firstName} ${user.attrs.lastName}`;
    document.getElementById('userEmail').textContent = user.attrs.email;
    document.getElementById('userAddress').textContent = `${user.attrs.addressStreet}, ${user.attrs.addressCity}, ${user.attrs.addressCountry}`;

    document.getElementById('userTelephone').textContent = user.attrs.tel;
    document.getElementById('userXP').textContent = getUserTotalXP(user).toFixed() + " kB";
    
    //Format the date
    const inputDate = user.attrs.dateOfBirth;
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Ensure leading zeros for day and month if they are less than 10
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    const formattedDate = `${formattedDay}.${formattedMonth}.${year}`;

    document.getElementById('userDOB').textContent = formattedDate;
    document.getElementById('userNationality').textContent = user.attrs.nationality;
};

const auditRatioGraph = (userData) => {
    const user = userData.data.user[0];
    const totalUp = user.totalUp;
    const totalDown = user.totalDown;
    const auditsDone = totalUp; // Audits Done
    const auditsReceived = totalDown; // Audits Received

    const maxBarWidth = 300;
    const barHeight = 30;
    const barSpacing = 10;

    // Calculate bar lengths based on the total number of audits done and received
    const barWidthDone = (auditsDone / totalDown) * maxBarWidth;
    const barWidthReceived = (auditsReceived / totalDown) * maxBarWidth;

    // Calculate the audits ratio
    const auditRatio = auditsDone / auditsReceived;

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', maxBarWidth + 120); // Adjust width to fit text
    svg.setAttribute('height', barHeight * 8); // Adjust height to accommodate bars and text

    // Create 'Audits Done' bar
    const barDone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    barDone.setAttribute('x', 10); // Position the 'Audits Done' bar
    barDone.setAttribute('y', barSpacing); // Position the 'Audits Done' bar
    barDone.setAttribute('width', barWidthDone); // Width based on 'Audits Done'
    barDone.setAttribute('height', barHeight);
    barDone.setAttribute('fill', '#89fc62'); // Color for 'Audits Done'

    // Create 'Audits Received' bar
    const barReceived = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    barReceived.setAttribute('x', 10); // Position the 'Audits Received' bar
    barReceived.setAttribute('y', barHeight + barSpacing * 2); // Position the 'Audits Received' bar
    barReceived.setAttribute('width', barWidthReceived); // Width based on 'Audits Received'
    barReceived.setAttribute('height', barHeight);
    barReceived.setAttribute('fill', '#1b71fa'); // Color for 'Audits Received'

    // Append bars to SVG
    svg.appendChild(barDone);
    svg.appendChild(barReceived);

    // Display the audits ratio (topmost text)
    const textRatio = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textRatio.setAttribute('x', (maxBarWidth + 120) / 2); // Position text for the audits ratio in the center
    textRatio.setAttribute('y', barSpacing + 20); // Position text for the audits ratio (vertically aligned)
    textRatio.setAttribute('font-size', '20'); // Increase font size for the audits ratio
    textRatio.setAttribute('text-anchor', 'middle'); // Center align text horizontally
    textRatio.textContent = `Audits ratio: ${auditRatio.toFixed(1)}`;

    // Display text labels for 'Audits Done' and 'Audits Received' in the middle of bars
    const textDone = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textDone.setAttribute('x', 10 + barWidthDone / 2); // Position text for 'Audits Done'
    textDone.setAttribute('y', barHeight / 2 + barSpacing); // Position text for 'Audits Done' (vertically centered)
    textDone.setAttribute('font-size', '14');
    textDone.setAttribute('text-anchor', 'middle'); // Center align text horizontally
    textDone.setAttribute('dominant-baseline', 'middle'); // Center align text vertically
    textDone.textContent = `Done: ${(auditsDone/1000000).toFixed(2)} MB`;

    const textReceived = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textReceived.setAttribute('x', 10 + barWidthReceived / 2); // Position text for 'Audits Received'
    textReceived.setAttribute('y', barHeight * 1.5 + barSpacing * 2); // Position text for 'Audits Received' (vertically centered)
    textReceived.setAttribute('font-size', '14');
    textReceived.setAttribute('text-anchor', 'middle'); // Center align text horizontally
    textReceived.setAttribute('dominant-baseline', 'middle'); // Center align text vertically
    textReceived.textContent = `Received: ${(auditsReceived / 1000000).toFixed(2)} MB`;
    
    // Calculate the center position of the SVG element vertically
    const svgHeight = barHeight * 8; // Assuming the SVG height is 8 times the bar height
    const centerVertically = svgHeight / 2;

    // Calculate y positions to center elements vertically
    const barDoneY = centerVertically - barHeight - barSpacing;
    const barReceivedY = centerVertically + barSpacing;
    const textDoneY = barDoneY + (barHeight/2);
    const textReceivedY = barReceivedY + (barHeight/2);
    const textRatioY = barSpacing + 20;

    // Set the y positions for elements
    barDone.setAttribute('y', barDoneY);
    barReceived.setAttribute('y', barReceivedY);
    textDone.setAttribute('y', textDoneY);
    textReceived.setAttribute('y', textReceivedY);
    textRatio.setAttribute('y', textRatioY);

    // Append text elements to the Bar elements for better centering

    // Append text labels to SVG
    svg.appendChild(textDone);
    svg.appendChild(textReceived);
    svg.appendChild(textRatio);

    // Append the SVG to the 'auditsGraph' div
    const auditsGraphDiv = document.getElementById('auditsGraph');
    auditsGraphDiv.innerHTML = ''; // Clear previous content
    auditsGraphDiv.appendChild(svg);
};

submitButton.addEventListener('click', getTokenFromEndpoint);

logOutButton.addEventListener('click', () => {
    authToken = null;
    console.log('Logged out. JWT cleared.');
    // Perform any other logout actions here

    // Hide user data section and display login form on logout
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('container').style.display = 'none';
    logOutButton.style.display = 'none';
});