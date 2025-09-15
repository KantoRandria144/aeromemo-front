import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Chip,
    CircularProgress,
    Alert,
    Paper,
    Grid
} from '@mui/material';
import { CalendarToday, LocationOn, People, Schedule } from '@mui/icons-material';
import { OutlookEvent, outlookService } from '../../../services/Reunion/outlookService';

const OutlookEventsList: React.FC = () => {
    const [events, setEvents] = useState<OutlookEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const outlookEvents = await outlookService.getEvents();
            setEvents(outlookEvents);
        } catch (err) {
            setError('Erreur lors du chargement des événements');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateTime: string, timeZone: string) => {
        return new Date(dateTime).toLocaleString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timeZone
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Événements Outlook
            </Typography>

            {events.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="textSecondary">
                        Aucun événement trouvé
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {events.map((event) => (
                        <Grid item xs={12} md={6} lg={4} key={event.id}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3
                                    }
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {event.subject || 'Sans titre'}
                                    </Typography>

                                    {event.bodyPreview && (
                                        <Typography 
                                            variant="body2" 
                                            color="textSecondary" 
                                            sx={{ mb: 2 }}
                                        >
                                            {event.bodyPreview.substring(0, 100)}...
                                        </Typography>
                                    )}

                                    <Box sx={{ mb: 2 }}>
                                        <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                                            <Schedule sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                                            <Typography variant="body2">
                                                {formatDateTime(event.start.dateTime, event.start.timeZone)}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <Schedule sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                                            <Typography variant="body2">
                                                {formatDateTime(event.end.dateTime, event.end.timeZone)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {event.location?.displayName && (
                                        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                                            <LocationOn sx={{ fontSize: 16, mr: 1, color: 'secondary.main' }} />
                                            <Typography variant="body2">
                                                {event.location.displayName}
                                            </Typography>
                                        </Box>
                                    )}

                                    {event.organizer && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" color="textSecondary">
                                                Organisé par: {event.organizer.emailAddress.name}
                                            </Typography>
                                        </Box>
                                    )}

                                    {event.attendees && event.attendees.length > 0 && (
                                        <Box>
                                            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                                                <People sx={{ fontSize: 16, mr: 1, color: 'info.main' }} />
                                                <Typography variant="subtitle2">
                                                    Participants ({event.attendees.length})
                                                </Typography>
                                            </Box>
                                            <List dense sx={{ py: 0 }}>
                                                {event.attendees.slice(0, 3).map((attendee, index) => (
                                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                                        <ListItemText
                                                            primary={attendee.emailAddress.name}
                                                            secondary={attendee.emailAddress.address}
                                                            primaryTypographyProps={{ variant: 'body2' }}
                                                            secondaryTypographyProps={{ variant: 'caption' }}
                                                        />
                                                        <Chip
                                                            label={attendee.type}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </ListItem>
                                                ))}
                                                {event.attendees.length > 3 && (
                                                    <ListItem sx={{ py: 0.5 }}>
                                                        <Typography variant="caption" color="textSecondary">
                                                            +{event.attendees.length - 3} autres participants
                                                        </Typography>
                                                    </ListItem>
                                                )}
                                            </List>
                                        </Box>
                                    )}

                                    {event.webLink && (
                                        <Box sx={{ mt: 2 }}>
                                            <a 
                                                href={event.webLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Chip
                                                    label="Ouvrir dans Outlook"
                                                    size="small"
                                                    clickable
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </a>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default OutlookEventsList;