<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../firms/practice.php';

class PracticesRouter extends Router
{
    private $practices;

    public function __construct($conn)
    {
        parent::__construct($conn);
        $this->practices = new practices($conn);
    }

    protected function get($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'practices') {
            if (!isset($uri[2]))
                $uri[2] = 0;
            $this->output($this->practices->getpractices($uri[2]));
        }
    }

    protected function post($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'practices') {
            $this->output($this->practices->save($input));
        }
    }

    protected function delete($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'practices') {
            $this->output($this->practices->delete($uri[2]));
        }
    }
}