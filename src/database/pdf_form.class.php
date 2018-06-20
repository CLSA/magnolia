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
    // make sure there is only ever one pdf_form per type which is active
    if( $this->active )
    {
      static::db()->execute(
        sprintf( 'UPDATE pdf_form SET active = 0 WHERE pdf_form_type_id = %s',
                 static::db()->format_string( $this->pdf_form_type_id )
        )
      );
    }

    parent::save();
  }
}
