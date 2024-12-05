const addEventToCalendar = async (userId, eventDetails) => {
  const tokens = await getTokensFromDB(userId);
  oAuth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const event = {
    summary: eventDetails.title,
    description: eventDetails.description,
    start: { dateTime: eventDetails.startTime, timeZone: 'Europe/Paris' },
    end: { dateTime: eventDetails.endTime, timeZone: 'Europe/Paris' },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  });

  return response.data;
};

const getTokensFromDB = async (userId) => {
  // Récupère les tokens pour cet utilisateur depuis la base de données
};