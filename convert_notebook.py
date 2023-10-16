import nbconvert
import sys

def convert_to_html(input_file, output_file):
    exporter = nbconvert.HTMLExporter()
    output_notebook = nbconvert.read(input_file, as_version=4)
    output, resources = exporter.from_notebook_node(output_notebook)
    with open(output_file, "w") as file:
        file.write(output)

if __name__ == "__main__":
    input_file = sys.argv[1]  # Path to .ipynb file
    output_file = sys.argv[2]  # Path to output HTML file
    convert_to_html(input_file, output_file)
