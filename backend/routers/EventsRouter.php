<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../firms/events.php';

class EventsRouter extends Router
{
    private $events;

    public function __construct($conn)
    {
        parent::__construct($conn);
        $this->events = new events($conn);

        $this->get('event/{id}', fn($p) => $this->events->getevent($p['id']));
        $this->raw('GET', 'events/generateICS/{id}', fn($p) => $this->events->generateICS($p['id']));
        $this->get('events/getFutureEvents', fn() => $this->events->getFutureEvents());
        $this->get('events/{firmId?}', fn($p) => $this->events->getEvents($p['firmId'] ?? null));

        $this->post('events', fn($p, $in) => $this->events->insert($in));
        $this->put('events', fn($p, $in) => $this->events->update($in));
        $this->delete('events/{id}', fn($p) => $this->events->delete($p['id']));
    }
}
