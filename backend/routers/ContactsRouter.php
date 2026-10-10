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

        $this->get('contacts/search/{q?}', fn($p) => $this->contacts->search($p['q'] ?? null));
        $this->raw('GET', 'contacts/exportVcf', fn($p, $in) => $this->exportVcf($in));
        $this->get('contacts/{firmId?}', fn($p) => $this->contacts->getFirmContacts($p['firmId'] ?? null));

        $this->post('contacts', fn($p, $in) => $this->contacts->insertContacts($in));
        $this->put('contacts', fn($p, $in) => $this->contacts->updateContacts($in));
        $this->delete('contacts/{id}', fn($p) => $this->contacts->deleteContact($p['id']));
    }

    private function exportVcf($input)
    {
        $exporter = new ContactVcfExporter($this->conn);
        $exporter->export($input);
        exit;
    }
}
