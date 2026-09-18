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
    }

    protected function get($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'event' && isset($uri[2])) {
            $this->output($this->events->getevent($uri[2]));
        } else if (isset($uri[1]) && $uri[1] === 'events' && isset($uri[2]) && $uri[2] === 'generateICS') {
            $this->events->generateICS($uri[3]);
        } else if (isset($uri[1]) && $uri[1] === 'events' && isset($uri[2]) && $uri[2] === 'getFutureEvents') {
            if (isset($uri[2]))
                $firm_id = $uri[2];
            else
                $firm_id = null;
            $this->output($this->events->getFutureEvents());
        } else if (isset($uri[1]) && $uri[1] === 'events') {
            if (isset($uri[2]))
                $firm_id = $uri[2];
            else
                $firm_id = null;
            $this->output($this->events->getEvents($firm_id));
        }
    }

    protected function post($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'events') {
            $this->output($this->events->insert($input));
        }
    }

    protected function put($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'events') {
            $this->output($this->events->update($input));
        }
    }

    protected function delete($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'events') {
            $this->output($this->events->delete($uri[2]));
        }
    }
}