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
    }

    protected function get($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'copyCampaign' && isset($uri[2])) {
            $this->output($this->campaigns->copyCampaign($uri[2]));
        } else if (isset($uri[1]) && $uri[1] === 'campaignAttachment' && isset($uri[2])) {
            $this->downloadAttachment($uri[2]);
            exit;
        } else if (isset($uri[1]) && $uri[1] === 'campaignExport') {
            $this->output($this->campaigns->getCampaignExport(isset($uri[2]) ? $uri[2] : 0));
        } else if (isset($uri[1]) && $uri[1] === 'campaigns' && isset($uri[2]) && $uri[2] === 'getCampaignSending') {
            $this->output($this->campaigns->getCampaignSending(isset($uri[3]) ? $uri[3] : 0));
        } else if (isset($uri[1]) && $uri[1] === 'campaigns') {
            $this->output($this->campaigns->getCampaigns());
        } else if (isset($uri[1]) && $uri[1] === 'getCampaignContacts' && isset($uri[2]) && $uri[2]) {
            $this->output($this->campaigns->getCampaignContacts($uri[2]));
        } else if (isset($uri[1]) && $uri[1] === 'campaign' && isset($uri[2]) && $uri[2]) {
            $this->output($this->campaigns->getCampaign($uri[2]));
        }
    }

    protected function post($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'campaigns') {
            $this->output($this->campaigns->insert($input));
        } else if (isset($uri[1]) && $uri[1] === 'getCampaignSeindingExport') {
            $this->output($this->campaigns->getCampaignSeindingExport($uri[2], $input));
        } else if (isset($uri[1]) && $uri[1] === 'campaignContacts') {
            $this->output($this->campaigns->campaignContactsUpdate($uri[2], $input));
        }
    }

    protected function put($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'campaigns') {
            $this->output($this->campaigns->update($input));
        }
    }

    protected function delete($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'campaignContacts') {
            $this->output($this->campaigns->deleteCampaignContacts($uri[2], $input));
        } else if (isset($uri[1]) && $uri[1] === 'campaign') {
            $this->output($this->campaigns->delete($uri[2]));
        }
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