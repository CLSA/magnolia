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
class pdf_form extends \cenozo\database\record
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
   * Override the parent method
   */
  public function delete()
  {
    $file = is_null( $this->filename ) ? NULL : $this->get_filename();
    parent::delete();
    if( !is_null( $file ) && file_exists( $file ) ) unlink( $file );
  }

  /**
   * Returns the path to the publication's file
   * 
   * @return string
   * @access public
   */
  public function get_filename()
  {
    return sprintf( '%s/%s.pdf', PDF_FORM_PATH, $this->id );
  }
}
