<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../firms/workshops.php';

class WorkshopsRouter extends Router
{
    private $workshops;

    public function __construct($conn)
    {
        parent::__construct($conn);
        $this->workshops = new workshops($conn);
    }

    protected function get($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'workshops') {
            $this->output($this->workshops->getworkshops($uri[2]));
        }
    }

    protected function post($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'workshops') {
            $this->output($this->workshops->insert($input));
        }
    }

    protected function put($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'workshops') {
            $this->output($this->workshops->update($input));
        }
    }

    protected function delete($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'workshops') {
            $this->output($this->workshops->delete($uri[2]));
        }
    }
}