var lastDragTime = 0
,   dragTimer    = 0;

class FileManager
{
  static init()
  {
    FileManager.playIndex = 0;
    FileManager.inputFile = document.getElementById("file");
    FileManager.inputFile.addEventListener("change", FileManager.onSelectFile);
    document.body.addEventListener("dragover", FileManager.onDropOver);
    document.body.addEventListener("drop", FileManager.onDrop);
  }
  
  static getNextFile(a)
  {
    a = a ? FileManager.playIndex + 1 : FileManager.playIndex - 1;
    return 0 <= a && a < fileList.length ? (FileManager.playIndex = a, fileList[a]) : null
  }

  static hasPreviousNext()
  {
    return [0 < FileManager.playIndex, FileManager.playIndex < fileList.length - 1]
  }

  static openFiles()
  {
    FileManager.inputFile.click();
  }

  static updateFileList(a)
  {
    if (0 < a.length)
    {
      fileList = Array.from(a);
      //////////////////////////////////////////////////
      FileManager.playIndex = 0;
      //////////////////////////////////////////////////
      Player.loadFile(fileList[0]);
    }
  }

  static onSelectFile(a)
  {
    FileManager.updateFileList(this.files);
    //////////////////////////////////////////////////
    this.value = null;
  }

  static toggleDropzone(a)
  {
    let b = document.body.firstElementChild,
        c = b.nextElementSibling;
    a
    ? (b.classList.add("d-none")   ,c.classList.remove("d-none"))
    : (b.classList.remove("d-none"),c.classList.add("d-none")   )
  }

  static dragEnd()
  {
    clearInterval(dragTimer = 0);
    //////////////////////////////////////////////////
    FileManager.toggleDropzone(false);
  }

  static onDropOver(a)
  {
    a.preventDefault();
    a.dataTransfer.dropEffect = "move";
    lastDragTime = performance.now();
    0 == dragTimer &&
    (
      FileManager.toggleDropzone(true),
      dragTimer = setInterval(function() {
        200 < performance.now() - lastDragTime && FileManager.dragEnd()
      }, 200)
    )
  }

  static onDrop(a)
  {
    a.preventDefault();
    FileManager.dragEnd();
    FileManager.updateFileList(a.dataTransfer.files);
  }
}

globalThis.FileManager = FileManager;