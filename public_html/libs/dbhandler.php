<?php
// set_error_handler('handleWarnings', E_WARNING);
function handleWarnings ($errno, $errstr) {
    echo "we have warning\n";
    echo "$errno\n";
    echo "$errstr\n";
}
class DbHandler {
    private $dbh;
    private $picsPath;
    private $picsAbsPath;
    public function __construct ()
    {
        require __DIR__ . DIRECTORY_SEPARATOR . './../config.php';
        $this->picsPath = $picsPath;
        $this->picsAbsPath = $picsAbsPath;
        $pdo_attrs = [ 
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ];
        $this->dbh = new PDO("mysql:host=$servername;dbname=$dbName;charset=utf8", $username, $password, $pdo_attrs);
    }
    public function getAllRecords ($how) {
        $stmt = $this->dbh->prepare("SELECT * FROM cars");
        $stmt->execute();
        $allRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($how == '') {
            return $allRecords;
        } elseif ($how == 'forsearchpage') {
            $carsToShow = [];
            foreach ($allRecords as $car) {
                $carsToShow[$car["group"]][] = $car["subgroup"];
            }
            return $carsToShow;
        } else throw new Exception('in else in getAllRecords, $how is not correct');
    }
    public function getRecord ($by, $key) {
        if ($by == 'id') {
            $stmt = $this->dbh->prepare("SELECT * FROM cars WHERE id=$key");
            $stmt->execute();
            $record = $stmt->fetch(PDO::FETCH_ASSOC);
            return $record;
        } elseif ($by == 'fullname') {
            $stmt = $this->dbh->prepare("SELECT * FROM cars WHERE FullName=\"$key\"");
            $stmt->execute();
            $record = $stmt->fetch(PDO::FETCH_ASSOC);
            return $record;
        } else throw new Exception('in getRecord in no if-else');
    }
    public function addRecord ($group, $subgroup, $content) {
        $fullName = $group . '-' . $subgroup;
        if ($content == '') $content = "{}";
        if (!$content = $this->populatePicsOfContent(true, $content, $fullName)) return false;
        if ($this->recordExists('fullname', $fullName)) return false;
        $stmt = $this->dbh->prepare("INSERT INTO cars (`group`, `subgroup`, `content`) VALUES (:group, :subgroup, :content)");
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':subgroup', $subgroup);
        $stmt->bindParam(':group', $group);
        $result = $stmt->execute();
        return $result;
    }
    public function recordExists($by, $key) {
        $recordLikeThis = $this->getRecord($by, $key);
        if ($recordLikeThis) return true;
        else return false;
    }
    public function deleteRecord($by, $key) {
        if ($by == 'id') {
            $stmt = $this->dbh->prepare("DELETE FROM cars WHERE id=$key");
            $result = $stmt->execute();
            return $result;
        } elseif ($by == 'fullname') {
            $stmt = $this->dbh->prepare("DELETE FROM cars WHERE FullName=\"$key\"");
            $result = $stmt->execute();
            return $result;
        } else throw new Exception('in deleteRecord in no if-else');
    }
    public function updateRecord($by, $key, $group, $subgroup, $content) {
        if (!$this->recordExists($by, $key)) {
            echo 'this is fucking problem2';
            return json_encode(['ok' => false]);
        }
        if ($content == '') $content = '{}';
        $fullname = $group . '-' . $subgroup;
        if (!$content = $this->populatePicsOfContent(true, $content, $fullname)) {
            echo "this is fucking problem1";
            echo "new content";
            echo $content;
            return json_encode(['ok' => false]);
        };
        if ($by == 'id') {
            $stmt = $this->dbh->prepare("UPDATE cars SET `group`=:group, `subgroup`=:subgroup, `content`=:content WHERE id=:key");
            $stmt->bindParam(':group', $group);
            $stmt->bindParam(':subgroup', $subgroup);
            $stmt->bindParam(':content', $content);
            $stmt->bindParam(':key', $key);
            $result = $stmt->execute();
            return $result;
        } elseif ($by == 'fullname') {
            $stmt = $this->dbh->prepare("UPDATE cars SET `group`=:group, `subgroup`=:subgroup, `content`=:content WHERE FullName=:key");
            $stmt->bindParam(':group', $group);
            $stmt->bindParam(':subgroup', $subgroup);
            $stmt->bindParam(':content', $content);
            $stmt->bindParam(':key', $key);
            $result = $stmt->execute();
            return json_encode(['ok' => true]);
        } else throw new Exception('in updateRecord in no if-else');
    }
    private function populatePicsOfContent ($stringified, $content, $fullname) {
        $pics = scandir($this->picsPath);
        $targetPics = [];
        foreach ($pics as $pic) {
            if (str_contains($pic, $fullname)) $targetPics[] = $pic;
        }
        if ($stringified) $content = json_decode($content, 1); // if stringified, turn it to array, otherwise it already is array
        if ($content === null) { // json_decoder can not decode $content since it's invalid json or null
            return false;
        } else { //json_decoder decoded $content, although it maybe empty
            $content['pics'] = [];
            foreach ($targetPics as $targetPic) {
                $content['pics'][] = $this->picsAbsPath . $targetPic;
            }
        }

        $content = json_encode($content, JSON_UNESCAPED_UNICODE);
        return $content;
    }
    public function search ($needle) {
        $stmt = $this->dbh->prepare("SELECT * FROM cars WHERE `group` LIKE :needle OR `subgroup` LIKE :needle OR `FullName` LIKE :needle");
        $needle = "%".$needle."%";
        $stmt->bindParam(':needle', $needle);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
    public function addPics ($imgs, $targetDir, $carName, $delPicsArray) {
        $ok = true;
        foreach ($delPicsArray as $picToDelName) {
            $delResult = $this->delPic($targetDir, $picToDelName);
            if (!$delResult) {
                $ok = false;
                ErrHandler::addErr('can not delete specified pics');
            }
        }
        if (!$ok) return json_encode(ErrHandler::$errors);
        foreach ($imgs as $img) {
            if (!$this->addPic($img, $targetDir, $carName)) $ok = false;
        }
        $okAnswer = [ "ok" => true ];
        if ($ok) return json_encode($okAnswer);
        else return json_encode(ErrHandler::$errors);
    }
    private function delPic ($targetDir, $picToDelName) {
        $targetFile = $targetDir . DIRECTORY_SEPARATOR . $picToDelName;
        if (unlink($targetFile)) return true;
        else return false;
    }
    private function delPic2 ($targetDir, $picToDelName, $carName) {
        $name = $carName . '-' . $picToDelName;
        $targetFile = $targetDir . DIRECTORY_SEPARATOR . $name;
        if (unlink($targetFile)) return true;
        else return false;
    }
    public function delPics ($picsArr) {
        $ok = true;
        foreach ($picsArr as $picArr) {
            $targetDir = $picArr[0];
            $picToDelName = $picArr[1];
            $carName = $picArr[2];
            if (!$this->delPic2($targetDir, $picToDelName, $carName)) $ok = false;
        }
        if (!$ok) return json_encode(['ok' => false, 'message' => 'some pics doesn\'t remove']);
        else return json_encode(['ok' => true, 'message' => 'all pics removed']);
    }
    public function addPic ($img, $targetDir, $carName) {
        $this->checkPic($img, $targetDir, $carName);
        $name = $carName . '-' . basename($img['name']);
        $targetFile = $targetDir . DIRECTORY_SEPARATOR . $name;
        if (!ErrHandler::$isPicOk) return false;
        if (move_uploaded_file($img['tmp_name'], $targetFile)) return true;
        else return false;
    }
    public function generateRandomString ($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
    }
    private function checkPic ($imgFile, $targetDir, $carName) {
        $name = $carName . '-' . basename($imgFile['name']);
        $targetFile = $targetDir . DIRECTORY_SEPARATOR . $name;
        $format = pathinfo($targetFile, PATHINFO_EXTENSION);
        if ($imgFile['size'] > 3000000) ErrHandler::addErr('size bigger than 1Mb');
        if ($imgFile['size'] <= 0) ErrHandler::addErr('size is zero or less!');
        if ($imgFile['error'] != 0) ErrHandler::addErr('$_FILES error is not 0');
        if (file_exists($targetFile)) ErrHandler::addErr('image already exists');
        if (!getimagesize($imgFile['tmp_name'])) ErrHandler::addErr('image is fake');
        if (!in_array($format, ['jpg', 'png', 'jpeg'])) ErrHandler::addErr('image format is not ok');
    }
}
class ErrHandler
{
    static public $isPicOk = true;
    static public $errors = [];
    static public function addErr ($err) {
        ErrHandler::$isPicOk = false;
        array_push(ErrHandler::$errors, $err);
    }
}