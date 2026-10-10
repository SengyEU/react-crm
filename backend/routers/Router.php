<?php

class Router
{
    protected $conn;
    private $routes = array();

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function handle($method, $uri, $input)
    {
        $path = $this->path($uri);

        foreach ($this->routes[$method] ?? array() as $route) {
            $params = $this->match($route[0], $path);
            if ($params !== null) {
                $result = call_user_func($route[1], $params, $input);
                if ($route[2]) {
                    $this->output($result);
                }
                return;
            }
        }

        if (!in_array($method, array('GET', 'POST', 'PUT', 'DELETE'), true)) {
            $this->output("err");
        }
    }

    protected function get($pattern, $handler)
    {
        $this->add('GET', $pattern, $handler, true);
    }

    protected function post($pattern, $handler)
    {
        $this->add('POST', $pattern, $handler, true);
    }

    protected function put($pattern, $handler)
    {
        $this->add('PUT', $pattern, $handler, true);
    }

    protected function delete($pattern, $handler)
    {
        $this->add('DELETE', $pattern, $handler, true);
    }

    protected function raw($method, $pattern, $handler)
    {
        $this->add($method, $pattern, $handler, false);
    }

    private function add($method, $pattern, $handler, $respond)
    {
        $this->routes[$method][] = array($pattern, $handler, $respond);
    }

    private function path($uri)
    {
        $path = array_slice($uri, 1);
        $last = count($path) - 1;
        if ($last >= 0 && ($pos = strpos($path[$last], '?')) !== false) {
            $path[$last] = substr($path[$last], 0, $pos);
        }
        while (count($path) > 0 && end($path) === '') {
            array_pop($path);
        }
        return $path;
    }

    private function match($pattern, $path)
    {
        $parts = $pattern === '' ? array() : explode('/', $pattern);
        $params = array();
        $i = 0;

        foreach ($parts as $part) {
            if ($part !== '' && $part[0] === '{') {
                $name = trim($part, '{}');
                $optional = false;
                if (substr($name, -1) === '?') {
                    $optional = true;
                    $name = substr($name, 0, -1);
                }
                if ($i < count($path)) {
                    $params[$name] = $path[$i];
                    $i++;
                } elseif (!$optional) {
                    return null;
                }
            } else {
                if ($i >= count($path) || $path[$i] !== $part) {
                    return null;
                }
                $i++;
            }
        }

        return $i === count($path) ? $params : null;
    }

    protected function output($str)
    {
        if (isset($_GET["csvexport"])) {
            $this->CSVoutput($str);
            exit;
        }

        if (!is_array($str)) {
            if ($str == "0")
                $str = "err";
            echo json_encode(array("msg" => $str));
        } else {
            echo json_encode($str);
        }
    }

    protected function CSVoutput($str)
    {
        if ($str == null)
            return;
        $csv = "";

        $fp = fopen(getcwd() . '/csvexport.csv', 'w');
        if (is_array($str)) {
            $firstRow = reset($str);
            $headers = array_merge([''], array_keys($firstRow));
            fputcsv($fp, $this->convert_encoding($headers), ';', '"', '\\');

            foreach ($str as $key => $row) {
                if (isset($row["name"]))
                    $row["name"] = preg_replace('/\/\(kont\).*/', '', $row["name"]);
                fputcsv($fp, $this->convert_encoding(array_merge([$key], $row)), ';', '"', '\\');
            }
        } else {
            $firstRow = [];
            fputs($fp, $str);
        }

        fclose($fp);
        header("Content-Type: text/plain; charset=Windows-1250");
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="/v3/csvexport.csv"');
        readfile(getcwd() . '/csvexport.csv');
        exit;
    }

    protected function convert_encoding($array)
    {
        return array_map(function ($value) {
            if ($value == null)
                return "";
            return iconv("UTF-8", "Windows-1250//IGNORE", $value);
        }, $array);
    }
}
