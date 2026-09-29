@echo off
echo Compiling CodeX Java Application...
if not exist bin mkdir bin
javac -encoding UTF-8 -cp "lib\gson-2.10.1.jar" -d bin src\com\codex\model\*.java src\com\codex\service\*.java src\com\codex\handler\*.java src\com\codex\*.java src\com\codex\test\*.java
if %errorlevel% neq 0 (
    echo Compilation failed.
    exit /b %errorlevel%
)
echo Compilation successful. Output in bin/
