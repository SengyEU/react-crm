<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../firms/contacts.php';
require_once __DIR__ . '/../firms/ContactVcfExporter.php';

class ContactsRouter extends Router
{
    private $contacts;

    public function __construct($conn)
    {
        parent::__construct($conn);
        $this->contacts = new contacts($conn);
    }

    protected function get($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'contacts' && isset($uri[2]) && $uri[2] === 'search') {
            $this->output($this->contacts->search($uri[3]));
        } else if (isset($uri[1]) && $uri[1] === 'contacts' && isset($uri[2]) && $uri[2] === 'exportVcf') {
            $exporter = new ContactVcfExporter($this->conn);
            $exporter->export($input);
            exit;
        } else if (isset($uri[1]) && $uri[1] === 'contacts') {
            $this->output($this->contacts->getFirmContacts($uri[2]));
        }
    }

    protected function post($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'contacts') {
            $this->output($this->contacts->insertContacts($input));
        }
    }

    protected function put($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'contacts') {
            $this->output($this->contacts->updateContacts($input));
        }
    }

    protected function delete($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'contacts') {
            $this->output($this->contacts->deleteContact($uri[2]));
        }
    }
}