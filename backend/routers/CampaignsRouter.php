<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../firms/campaign.php';

class CampaignsRouter extends Router
{
    private $campaigns;

    public function __construct($conn)
    {
        parent::__construct($conn);
        $this->campaigns = new campaigns($conn);

        $this->get('copyCampaign/{id}', fn($p) => $this->campaigns->copyCampaign($p['id']));
        $this->raw('GET', 'campaignAttachment/{id}', fn($p) => $this->downloadAttachment($p['id']));
        $this->get('campaignExport/{id?}', fn($p) => $this->campaigns->getCampaignExport($p['id'] ?? 0));
        $this->get('campaigns/getCampaignSending/{id?}', fn($p) => $this->campaigns->getCampaignSending($p['id'] ?? 0));
        $this->get('campaigns/{id?}', fn() => $this->campaigns->getCampaigns());
        $this->get('getCampaignContacts/{id}', fn($p) => $this->campaigns->getCampaignContacts($p['id']));
        $this->get('campaign/{id}', fn($p) => $this->campaigns->getCampaign($p['id']));

        $this->post('campaigns', fn($p, $in) => $this->campaigns->insert($in));
        $this->post('getCampaignSeindingExport/{id?}', fn($p, $in) => $this->campaigns->getCampaignSeindingExport($p['id'] ?? null, $in));
        $this->post('campaignContacts/{id}', fn($p, $in) => $this->campaigns->campaignContactsUpdate($p['id'], $in));

        $this->put('campaigns/{id?}', fn($p, $in) => $this->campaigns->update($in));

        $this->delete('campaignContacts/{id}', fn($p, $in) => $this->campaigns->deleteCampaignContacts($p['id'], $in));
        $this->delete('campaign/{id}', fn($p) => $this->campaigns->delete($p['id']));
    }

    private function downloadAttachment($id)
    {
        $data = $this->campaigns->getAttachment($id);

        if (!$data || !$data["attachment"]) {
            http_response_code(404);
            echo "Soubor nenalezen";
            exit;
        }

        $filename = $data["attachment_name"];
        $filedata = $data["attachment"]; // binární data (BLOB)

        header("Content-Type: application/octet-stream");
        header("Content-Disposition: attachment; filename=\"$filename\"");
        header("Content-Length: " . strlen($filedata));

        echo $filedata;
        exit;
    }
}
