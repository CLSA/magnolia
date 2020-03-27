<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\self;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Special service for handling the patch meta-resource
 */
class patch extends \cenozo\service\self\patch
{
  /**
   * Override parent method
   */
  public function execute()
  {
    // handle setting applicant.newsletter
    $patch_array = $this->get_file_as_array();
    if( 1 == count( $patch_array ) && array_key_exists( 'applicant', $patch_array ) )
    {
      $applicant_array = (array) $patch_array['applicant'];
      if( array_key_exists( 'newsletter', $applicant_array ) )
        lib::create( 'business\session' )->get_user()->set_newsletter( $applicant_array['newsletter'] );
    }
    else parent::execute();
  }
}
