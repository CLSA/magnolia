<?php
/**
 * pdf_form.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * pdf_form: record
 */
class pdf_form extends \cenozo\database\has_data
{
  /**
   * Override parent method
   */
  public function save()
  {
    parent::save();

    // make sure there is only ever one pdf_form per type which is active
    if( $this->active )
    {
      $modifier = lib::create( 'database\modifier' );
      $modifier->where( 'pdf_form_type_id', '=', $this->pdf_form_type_id );
      $modifier->where( 'id', '!=', $this->id );
      static::db()->execute( sprintf( 'UPDATE pdf_form SET active = 0 %s', $modifier->get_sql() ) );
    }
  }

  /**
   * Writes the filled template file to disk, returning any errors.
   * 
   * @param array $data An array of key=>value pairs to fill into the PDF form
   * @param string $filename Where to write the filled-out PDF file
   * @return string Any errors encountered while writing the PDF (NULL if there are none)
   */
  public function fill_and_write_form( $data, $filename )
  {
    // temporarily write the pdf template to disk
    $this->create_data_file();

    $pdf_writer = lib::create( 'business\pdf_writer' );
    $pdf_writer->set_template( $this->get_data_filename() );
    $pdf_writer->fill_form( $data );
    $success = $pdf_writer->save( $filename );

    // delete the temporary pdf template file
    $this->delete_data_file();

    return $success ? NULL : $pdf_writer->get_error();
  }
}
